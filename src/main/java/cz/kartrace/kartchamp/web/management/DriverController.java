package cz.kartrace.kartchamp.web.management;

import cz.kartrace.kartchamp.domain.Driver;
import cz.kartrace.kartchamp.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * @author hradecky
 */
@Controller
public class DriverController {

    private DriverService driverService;

    @Autowired
    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @RequestMapping("/management/driver")
    public String index(Model model) {
        model.addAttribute("drivers", driverService.getDrivers());
        return "management/driver";
    }

    @RequestMapping("/management/driver/add")
    public String add(Model model) {
        model.addAttribute("driver", new Driver("", ""));
        return "management/driver_edit";
    }

    @RequestMapping("/management/driver/edit/{driverId}")
    public String edit(@PathVariable(value="driverId") String driverId, Model model) {
        model.addAttribute("driver", driverService.getDriverById(driverId));
        return "management/driver_edit";
    }

    @RequestMapping(
            headers = {"content-type=application/json"},
            method = RequestMethod.POST, value = "/management/driver/save")
    @ResponseBody
    public Driver save(@RequestBody Driver driver) {
        return driverService.save(driver);
    }

}
